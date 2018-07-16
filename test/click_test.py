# ./click_test.py
import click


@click.group()      # ①
@click.option('--count', "-c", default=1, type=click.INT, help="数字")  # ②
@click.option('--name', "-n", prompt='Your name', help="字符")
def main(count, name):
    for x in range(count):
            click.echo('Hello %s!' % name)


@click.command(help="帮助 c1")
def c1():
    pass


@click.command()
@click.option('--name', "-n", default='l1xnan', type=click.STRING, help="你的名字")
def c2(name):
    """帮助 c2"""
    click.echo("你输入的姓名为：", name)


main.add_command(c1)
main.add_command(c2)

if __name__ == '__main__':
    main()
